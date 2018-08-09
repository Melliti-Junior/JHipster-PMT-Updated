package com.erp.app.web.rest.custom;

import com.codahale.metrics.annotation.Timed;
import com.erp.app.domain.custom.IssueCustom;
import com.erp.app.repository.custom.IssueCustomRepository;
import com.erp.app.repository.search.custom.IssueCustomSearchRepository;
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
public class IssueCustomResource {

	private final Logger log = LoggerFactory.getLogger(IssueCustomResource.class);

    private static final String ENTITY_NAME = "issuecustom";

    private final IssueCustomRepository issuecustomRepository;

    private final IssueCustomSearchRepository issuecustomSearchRepository;

    public IssueCustomResource(IssueCustomRepository issuecustomRepository, IssueCustomSearchRepository issuecustomSearchRepository) {
        this.issuecustomRepository = issuecustomRepository;
        this.issuecustomSearchRepository = issuecustomSearchRepository;
    }

    /**
     * POST  /issuecustoms : Create a new issuecustom.
     *
     * @param issuecustom the issuecustom to create
     * @return the ResponseEntity with status 201 (Created) and with body the new issuecustom, or with status 400 (Bad Request) if the issuecustom has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/issuecustoms")
    @Timed
    public ResponseEntity<IssueCustom> createIssueCustom(@Valid @RequestBody IssueCustom issuecustom) throws URISyntaxException {
        log.debug("REST request to save IssueCustom : {}", issuecustom);
        if (issuecustom.getId() != null) {
            throw new BadRequestAlertException("A new issuecustom cannot already have an ID", ENTITY_NAME, "idexists");
        }
        IssueCustom result = issuecustomRepository.save(issuecustom);
        issuecustomSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/custom/issuecustoms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /issuecustoms : Updates an existing issuecustom.
     *
     * @param issuecustom the issuecustom to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated issuecustom,
     * or with status 400 (Bad Request) if the issuecustom is not valid,
     * or with status 500 (Internal Server Error) if the issuecustom couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/issuecustoms")
    @Timed
    public ResponseEntity<IssueCustom> updateIssueCustom(@Valid @RequestBody IssueCustom issuecustom) throws URISyntaxException {
        log.debug("REST request to update IssueCustom : {}", issuecustom);
        if (issuecustom.getId() == null) {
            return createIssueCustom(issuecustom);
        }
        IssueCustom result = issuecustomRepository.save(issuecustom);
        issuecustomSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, issuecustom.getId().toString()))
            .body(result);
    }

    /**
     * GET  /issuecustoms : get all the issuecustoms.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of issuecustoms in body
     */
    @GetMapping("/issuecustoms")
    @Timed
    public ResponseEntity<List<IssueCustom>> getAllIssueCustoms(Pageable pageable) {
        log.debug("REST request to get a page of IssueCustoms");
        Page<IssueCustom> page = issuecustomRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/custom/issuecustoms");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /issuecustoms/:id : get the "id" issuecustom.
     *
     * @param id the id of the issuecustom to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the issuecustom, or with status 404 (Not Found)
     */
    @GetMapping("/issuecustoms/{id}")
    @Timed
    public ResponseEntity<IssueCustom> getIssueCustom(@PathVariable String id) {
        log.debug("REST request to get IssueCustom : {}", id);
        IssueCustom issuecustom = issuecustomRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(issuecustom));
    }

    /**
     * DELETE  /issuecustoms/:id : delete the "id" issuecustom.
     *
     * @param id the id of the issuecustom to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/issuecustoms/{id}")
    @Timed
    public ResponseEntity<Void> deleteIssueCustom(@PathVariable String id) {
        log.debug("REST request to delete IssueCustom : {}", id);
        issuecustomRepository.delete(id);
        issuecustomSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/issuecustoms?query=:query : search for the issuecustom corresponding
     * to the query.
     *
     * @param query the query of the issuecustom search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/issuecustoms")
    @Timed
    public ResponseEntity<List<IssueCustom>> searchIssueCustoms(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of IssueCustoms for query {}", query);
        Page<IssueCustom> page = issuecustomSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/custom/_search/issuecustoms");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }


}
