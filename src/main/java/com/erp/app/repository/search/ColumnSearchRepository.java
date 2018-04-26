package com.erp.app.repository.search;

import com.erp.app.domain.Column;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Column entity.
 */
public interface ColumnSearchRepository extends ElasticsearchRepository<Column, String> {
}
