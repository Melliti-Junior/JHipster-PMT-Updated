package com.erp.app.web.rest.custom;

import com.codahale.metrics.annotation.Timed;
import com.erp.app.domain.custom.ColumnCustom;
import com.erp.app.repository.custom.ColumnCustomRepository;
import com.erp.app.repository.search.custom.ColumnCustomSearchRepository;
import com.erp.app.web.rest.errors.BadRequestAlertException;
import com.erp.app.web.rest.util.HeaderUtil;
import com.erp.app.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

@RestController
@RequestMapping("/api/custom")
public class ColumnCustomResource {

	private final Logger log = LoggerFactory.getLogger(ColumnCustomResource.class);

    private static final String ENTITY_NAME = "columncustom";

    private final ColumnCustomRepository columncustomRepository;

    private final ColumnCustomSearchRepository columncustomSearchRepository;

    public ColumnCustomResource(ColumnCustomRepository columncustomRepository, ColumnCustomSearchRepository columncustomSearchRepository) {
        this.columncustomRepository = columncustomRepository;
        this.columncustomSearchRepository = columncustomSearchRepository;
    }

    /**
     * POST  /columncustoms : Create a new columncustom.
     *
     * @param columncustom the columncustom to create
     * @return the ResponseEntity with status 201 (Created) and with body the new columncustom, or with status 400 (Bad Request) if the columncustom has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/columncustoms")
    @Timed
    public ResponseEntity<ColumnCustom> createColumnCustom(@Valid @RequestBody ColumnCustom columncustom) throws URISyntaxException {
        log.debug("REST request to save ColumnCustom : {}", columncustom);
        if (columncustom.getId() != null) {
            throw new BadRequestAlertException("A new columncustom cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ColumnCustom result = columncustomRepository.save(columncustom);
        columncustomSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/custom/columncustoms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /columncustoms : Updates an existing columncustom.
     *
     * @param columncustom the columncustom to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated columncustom,
     * or with status 400 (Bad Request) if the columncustom is not valid,
     * or with status 500 (Internal Server Error) if the columncustom couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/columncustoms")
    @Timed
    public ResponseEntity<ColumnCustom> updateColumnCustom(@Valid @RequestBody ColumnCustom columncustom) throws URISyntaxException {
        log.debug("REST request to update ColumnCustom : {}", columncustom);
        if (columncustom.getId() == null) {
            return createColumnCustom(columncustom);
        }
        ColumnCustom result = columncustomRepository.save(columncustom);
        columncustomSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, columncustom.getId().toString()))
            .body(result);
    }

    /**
     * GET  /columncustoms : get all the columncustoms.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of columncustoms in body
     */
    @GetMapping("/columncustoms")
    @Timed
    public ResponseEntity<List<ColumnCustom>> getAllColumnCustoms(Pageable pageable) {
        log.debug("REST request to get a page of ColumnCustoms");
        Page<ColumnCustom> page = columncustomRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/custom/columncustoms");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /columncustoms/:id : get the "id" columncustom.
     *
     * @param id the id of the columncustom to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the columncustom, or with status 404 (Not Found)
     */
    @GetMapping("/columncustoms/{id}")
    @Timed
    public ResponseEntity<ColumnCustom> getColumnCustom(@PathVariable String id) {
        log.debug("REST request to get ColumnCustom : {}", id);
        ColumnCustom columncustom = columncustomRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(columncustom));
    }

    /**
     * DELETE  /columncustoms/:id : delete the "id" columncustom.
     *
     * @param id the id of the columncustom to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/columncustoms/{id}")
    @Timed
    public ResponseEntity<Void> deleteColumnCustom(@PathVariable String id) {
        log.debug("REST request to delete ColumnCustom : {}", id);
        columncustomRepository.delete(id);
        columncustomSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/columncustoms?query=:query : search for the columncustom corresponding
     * to the query.
     *
     * @param query the query of the columncustom search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/columncustoms")
    @Timed
    public ResponseEntity<List<ColumnCustom>> searchColumnCustoms(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of ColumnCustoms for query {}", query);
        Page<ColumnCustom> page = columncustomSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/custom/_search/columncustoms");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }


}
